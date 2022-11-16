import { createContext, useEffect, useState } from "react";
import { Play, HandPalm } from "phosphor-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod"; // a lib n possui um export default
import { FormProvider, useForm } from "react-hook-form";

import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/CountDown";

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "../Home/styles";

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishDate?: Date;
}

interface CyclesContextType {
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "Informe a tarefa"),
  minutesAmount: zod
    .number()
    .min(5, "O ciclo precisa ser de no mínimo 5 minutos.")
    .max(60, "O ciclo precisa ser de no máximo 60 minutos."),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);

  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  // register retorna varias funções como por exemplo: onChange
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  const { handleSubmit, watch, reset } = newCycleForm;

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId); // percorre os ciclos e encontra qual ciclo é igual ao ciclo ativo

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function markCurrentCycleAsFinished() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishDate: new Date() };
        } else {
          return cycle;
        }
      })
    );
  }

  function handleInterruptCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() };
        } else {
          return cycle;
        }
      })
    );
    setActiveCycleId(null);
  }

  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = String(new Date().getTime());

    // o data retorna os dados dos inputs do form
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    setCycles((state) => [...state, newCycle]); // pegar tds os ciclos que ja exitesm no array e adc o novo do final
    setActiveCycleId(id);
    setAmountSecondsPassed(0);

    reset(); // reseta o form após enviado, para isso precisa passar o defaultValues
  }

  const task = watch("task"); // assiste o campo de task
  const isSubmitDesabled = !task;

  return (
    <HomeContainer>
      {/* função do useForm que recebee como parametro nossa função */}
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <CyclesContext.Provider
          value={{
            activeCycle,
            activeCycleId,
            markCurrentCycleAsFinished,
            amountSecondsPassed,
            setSecondsPassed,
          }}
        >
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <Countdown />
        </CyclesContext.Provider>
        {activeCycle ? (
          <StopCountdownButton
            type="button"
            onClick={() => handleInterruptCycle()}
          >
            <HandPalm size={24} /> Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDesabled} type="submit">
            <Play size={24} /> Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
