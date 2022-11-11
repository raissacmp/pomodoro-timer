import { Play } from "phosphor-react";
import { useForm } from "react-hook-form";
import {
  FormContainer,
  HomeContainer,
  CountdownContainer,
  Separator,
  StartCountdownButton,
  TaskInput,
  MinutesAmountInput,
} from "../Home/styles";

export function Home() {
  // register retorna varias funções como por exemplo: onChange

  const { register, handleSubmit, watch } = useForm();

  function handleCreateNewCycle(data: any) {
    // o data retorna os dados dos inputs do form
    console.log(
      "🚀 ~ file: index.tsx ~ line 20 ~ handleCreateNewCycle ~ data",
      data
    );
  }

  const task = watch("task"); // assiste o campo de task
  const isSubmitDesabled = !task;

  return (
    <HomeContainer>
      {/* função do useForm que recebee como parametro nossa função */}
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            type="text"
            placeholder="Dê um nome para o seu projeto"
            list="task-suggestions" // trás as sugestões definidas no datalist
            {...register("task")} // pega todas funções e retornos do registe e coloca no nosso input e o parametro "task" faz a mesma coisa que o name
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
            min={5} // começar com 5
            max={60} // maximo 60
            {...register("minutesAmount", { valueAsNumber: true })} // objeto de configurações, o valor desse input pra numero
          />
          <span>minutos</span>
        </FormContainer>
        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>
        <StartCountdownButton disabled={isSubmitDesabled} type="submit">
          <Play size={24} /> Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  );
}
