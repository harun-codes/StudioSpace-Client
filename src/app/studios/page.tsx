
import StudiosExplorer from "./studios-explorer";

type SearchParams = {
  category?: string | string[];
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function StudiosPage({ searchParams }: Props) {
  const params = await searchParams;

  const category = Array.isArray(params.category)
    ? params.category[0]
    : params.category;

  return <StudiosExplorer initialCategory={category || "All Studios"} />;
}
