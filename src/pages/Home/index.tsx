import { useContext } from "react";
import { Play, HandPalm } from "phosphor-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod"; // a lib n possui um export default
import { FormProvider, useForm } from "react-hook-form";

import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/CountDown";
import { CyclesContext } from "../../contexts/CyclesContext";

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "../Home/styles";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "Informe a tarefa"),
  minutesAmount: zod
    .number()
    .min(5, "O ciclo precisa ser de no mínimo 5 minutos.")
    .max(60, "O ciclo precisa ser de no máximo 60 minutos."),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

export function Home() {
  const { createNewCycle, activeCycle, interruptCurrentCycle } =
    useContext(CyclesContext);

  // register retorna varias funções como por exemplo: onChange
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  const { handleSubmit, watch, reset } = newCycleForm;

  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data);
    reset(); // reseta o form após enviado, para isso precisa passar o defaultValues
  }

  const task = watch("task"); // assiste o campo de task
  const isSubmitDesabled = !task;

  return (
    <HomeContainer>
      {/* função do useForm que recebee como parametro nossa função */}
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        {activeCycle ? (
          <StopCountdownButton
            type="button"
            onClick={() => interruptCurrentCycle()}
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
