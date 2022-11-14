import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod"; // a lib n possui um export default
import { useForm } from "react-hook-form";
import { differenceInSeconds } from "date-fns";

import { useEffect } from "react";

import { FormContainer, TaskInput, MinutesAmountInput } from "./styles";

export function NewCycleForm() {
  // register retorna varias funções como por exemplo: onChange
  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  // register retorna varias funções como por exemplo: onChange
  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate
        ); // diferença de segundos entre o horario atual e o horario do play
        if (secondsDifference >= totalSeconds) {
          setCycles((state) =>
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishDate: new Date() };
              } else {
                return cycle;
              }
            })
          );
          setAmountSecondsPassed(totalSeconds);
          clearInterval(interval);
        } else {
          setAmountSecondsPassed(secondsDifference);
        }
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [activeCycle, totalSeconds, activeCycleId]);

  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>
      <TaskInput
        id="task"
        type="text"
        placeholder="Dê um nome para o seu projeto"
        list="task-suggestions" // trás as sugestões definidas no datalist
        {...register("task")} // pega todas funções e retornos do registe e coloca no nosso input e o parametro "task" faz a mesma coisa que o name
        disabled={!!activeCycle} // desabilitar caso tenha algum ciclo ativo
      />
      <datalist id="task-suggestions">
        <option value="Projeto 1" />
        <option value="Projeto 2" />
        <option value="Projeto 3" />
      </datalist>

      <label htmlFor="minutesAmount">Durante</label>
      <MinutesAmountInput
        type="number"
        id="minutesAmount"
        placeholder="00"
        step={5} // pular de 5 em 5
        min={1} // começar com 5
        max={60} // maximo 60
        disabled={!!activeCycle}
        {...register("minutesAmount", { valueAsNumber: true })} // objeto de configurações, o valor desse input pra numero
      />
      <span>minutos</span>
    </FormContainer>
  );
}
