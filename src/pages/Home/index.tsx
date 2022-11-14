import { Play } from "phosphor-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod"; // a lib n possui um export default
import {
  FormContainer,
  HomeContainer,
  CountdownContainer,
  Separator,
  StartCountdownButton,
  TaskInput,
  MinutesAmountInput,
} from "../Home/styles";

// schema que vai definir os formatos das informações e as validações

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "Informe a tarefa"), // uma string com no minimo um caracter
  minutesAmount: zod
    .number()
    .min(5, "O ciclo precisa ser de no mínimo 5 minutos")
    .max(60, "O ciclo precisa ser de no máximo 60 minutos"), // um numero o valor minimo de 5 e o valor maximo de 60
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>; // tipa automaticamente pela definição da variavel

export function Home() {
  // register retorna varias funções como por exemplo: onChange

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  function handleCreateNewCycle(data: NewCycleFormData) {
    // o data retorna os dados dos inputs do form
    console.log(
      "🚀 ~ file: index.tsx ~ line 20 ~ handleCreateNewCycle ~ data",
      data
    );
    reset(); // reseta o form após enviado, para isso precisa passar o defaultValues
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
