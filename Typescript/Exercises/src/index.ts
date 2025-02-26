//Exercise 1
function getUsername(username: string | null) {
    if (username !== null) {
      return `User: ${username}`
    } else {
      return 'Guest'
    }
  }
  
  //Exercise 2
  type Direction = "up" | "down" | "left" | "right";
  function move(direction: Direction, distance: number) {
    console.log(`Move: ${direction}, ${distance}`)
  }
  
  //Exercise 3
  function validateUsername(username: string | null): boolean {
    if (username !== null) {
      return username.length > 5
    }
    
    return false
  }
  
  //Exercise 4
  // const appElement:HTMLElement = document.getElementById('app') as HTMLElement
  //
  // if(!appElement){
  //   throw new Error('App element not found')
  // }
  // console.log(appElement)
  
  //Exercise 5
  type APIResponse =
    | {
        data: {
          id: string
        }
      }
    | {
        error: string
      }
  
  const handleResponse = (response: APIResponse) => {
    if ('data' in response) {
      return response.data.id
    } else {
      throw new Error(response.error)
    }
  }
  
  //Exercise 6
  const somethingDangerous = () => {
    if (Math.random() <= 0.5) {
      throw new Error('Something went wrong')
    }
    
    return 'all good'
  }
  
  //Exercise 7
  const parseValue = (value: unknown): string => {
    if (
      typeof value === 'object' &&
      value !== null &&
      'data' in value &&
      typeof value.data === 'object' &&
      value.data !== null &&
      'id' in value.data &&
      typeof value.data.id === 'string'
    ) {
      return value.data.id
    }
    
    throw new Error('Parsing error!')
  }
  
  //Exercise 8
  type Circle = {
    kind: 'circle'
    radius: number
  }
  
  type Square = {
    kind: 'square'
    sideLength: number
  }
  
  type Shape = Circle | Square
  
  const squareShape: Shape = {
    kind: 'square',
    sideLength: 5
  }
  
  function calculateArea(shape: Shape) {
    if (shape.kind === 'circle') {
      return Math.PI * shape.radius * shape.radius
    } else if (shape.kind === 'square') {
      return shape.sideLength * shape.sideLength
    } else {
      throw new Error('Invalid shape')
    }
  }
  
  //Exercise 9
  function calculateArea2(shape: Shape) {
    switch(shape.kind) {
      case 'circle':
        return Math.PI * shape.radius * shape.radius;
      case 'square':
        return shape.sideLength * shape.sideLength;
      default:
        throw new Error('Invalid shape');
    }
  }
  
  // Exercise 10: Discriminated Tuples
  type User = {
    id: number;
    name: string;
    email: string;
  };
  
  // Improved type with discriminated tuple
  type APIResponseTuple = 
    | ['success', User[]]
    | ['error', string];
  
  async function fetchData(): Promise<APIResponseTuple> {
    try {
      const response = await fetch('https://api.example.com/data');
  
      if (!response.ok) {
        return [
          'error',
          'An error occurred',
        ];
      }
  
      const data = await response.json();
  
      return ['success', data];
    } catch (error) {
      return ['error', 'An error occurred'];
    }
  }
  
  // Mock implementation for testing (avoids actual fetch calls)
  async function fetchDataMock(shouldSucceed: boolean): Promise<APIResponseTuple> {
    if (shouldSucceed) {
      const mockUsers: User[] = [
        { id: 1, name: 'John', email: 'john@example.com' },
        { id: 2, name: 'Jane', email: 'jane@example.com' }
      ];
      return ['success', mockUsers];
    } else {
      return ['error', 'An error occurred'];
    }
  }
  
  // Exercise 11: Handling Defaults with a Discriminated Union
  type CircleWithOptionalKind = Omit<Circle, 'kind'> & { kind?: 'circle' };
  type ExtendedShape = Shape | CircleWithOptionalKind;
  
  function calculateAreaWithDefaults(shape: ExtendedShape): number {
    if (!('kind' in shape) || shape.kind === 'circle') {
      return Math.PI * shape.radius * shape.radius;
    } else if (shape.kind === 'square') {
      return shape.sideLength * shape.sideLength;
    } else {
      throw new Error('Invalid shape');
    }
  }
  
  export { 
    getUsername, 
    move, 
    validateUsername, 
    handleResponse, 
    somethingDangerous, 
    parseValue, 
    calculateArea, 
    calculateArea2,
    fetchData,
    fetchDataMock,
    calculateAreaWithDefaults,
    type User,
    type APIResponseTuple,
    type ExtendedShape
  };