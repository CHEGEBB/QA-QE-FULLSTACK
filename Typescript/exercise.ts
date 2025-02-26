type Recipe = {
    title: string;
    instructions: string;
    ingredients: ingredientType [];
  };
  type ingredientType  = { name: string; quantity: string }
  
  const processRecipe = (recipe: Recipe) => {
    // Do something with the recipe in here
  };
  
  processRecipe({
    title: "Chocolate Chip Cookies",
    ingredients: [
      { name: "Flour", quantity: "2 cups" },
      { name: "Sugar", quantity: "1 cup" },
    ],
    instructions: "...",
  });

  const concatName = (first: string, last?: string) => {
    if (!last) {
      return first;
    }
  
    return `${first} ${last}`;
  };
  
  const result = concatName("John", "Doe");
  const result2 = concatName("John");

  it("should return the full name", () => {
  const result = concatName("John", "Doe");

  type test = Expect<Equal<typeof result, string>>;

  expect(result).toEqual("John Doe");
});

interface Employee{
  name: string;
  employeeId :number;
}
interface Manager extends Employee{
  name:'John Doe'
  employeeId:1234;
  
}