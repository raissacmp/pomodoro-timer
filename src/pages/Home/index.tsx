import { useEffect, useState } from "react";
import { Play, HandPalm } from "phosphor-react";

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

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);

  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId); // percorre os ciclos e encontra qual ciclo é igual ao ciclo ativo

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

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

  const minutesAmount = Math.floor(currentSeconds / 60);

  const secondsAmount = currentSeconds % 60;

  const minutes = String(minutesAmount).padStart(2, "0"); // especifico que o valor tem q ter dois caracteres, caso n tenha preencho com o 0
  const seconds = String(secondsAmount).padStart(2, "0");

  // alterando o titulo page

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`;
    }
  }, [minutes, seconds, activeCycle]);

  const task = watch("task"); // assiste o campo de task
  const isSubmitDesabled = !task;

  return (
    <HomeContainer>
      {/* função do useForm que recebee como parametro nossa função */}
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <NewCycleForm />
        <Countdown />
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
