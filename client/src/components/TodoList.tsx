import TodoItem from "./TodoItem";

export type todos = {
	id: string;
	userId: string;
	title: string;
	description: string | null;
	complete: boolean | null;
	createdAt: string | null;
	updatedAt: string | null;
};

type Props = {
	todos: todos[] | undefined;
};

function TodoList({ todos }: Props) {
	return (
		<ul>
			{todos?.map((todo) => (
				<TodoItem key={todo.id} todo={todo} />
			))}
		</ul>
	);
}

export default TodoList;
