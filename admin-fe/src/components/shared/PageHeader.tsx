
const PageHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <header>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </header>
  );
};

export default PageHeader;
