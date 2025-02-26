import { 
    getUsername, 
    move, 
    validateUsername, 
    handleResponse, 
    somethingDangerous, 
    parseValue, 
    calculateArea, 
    calculateArea2,
    fetchDataMock,
    calculateAreaWithDefaults,
    type User,
    type ExtendedShape
  } from '../src/index';
  
  // Mock console.log to prevent output during tests
  const originalConsoleLog = console.log;
  beforeAll(() => {
    console.log = jest.fn();
  });
  
  afterAll(() => {
    console.log = originalConsoleLog;
  });
  
  // Exercise 1 Tests
  describe('Exercise 1: getUsername', () => {
    test('returns formatted username when username is provided', () => {
      expect(getUsername('Alice')).toBe('User: Alice');
    });
  
    test('returns Guest when username is null', () => {
      expect(getUsername(null)).toBe('Guest');
    });
  });
  
  // Exercise 2 Tests
  describe('Exercise 2: move', () => {
    test('logs the correct movement information', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      
      move('up', 10);
      expect(consoleSpy).toHaveBeenCalledWith('Move: up, 10');
      
      move('left', 5);
      expect(consoleSpy).toHaveBeenCalledWith('Move: left, 5');
      
      move('right', 10);
      expect(consoleSpy).toHaveBeenCalledWith('Move: right, 10');
      
      consoleSpy.mockRestore();
    });
  });
  
  // Exercise 3 Tests
  describe('Exercise 3: validateUsername', () => {
    test('returns true for usernames longer than 5 characters', () => {
      expect(validateUsername('yobiiiiiii')).toBe(true);
    });
  
    test('returns false for usernames 5 characters or shorter', () => {
      expect(validateUsername('short')).toBe(false);
    });
  
    test('returns false for null username', () => {
      expect(validateUsername(null)).toBe(false);
    });
  });
  
  // Exercise 5 Tests
  describe('Exercise 5: handleResponse', () => {
    test('returns id when response contains data', () => {
      const response = { data: { id: '123' } };
      expect(handleResponse(response)).toBe('123');
    });
  
    test('throws an error when response contains error', () => {
      const response = { error: 'Something went wrong' };
      expect(() => handleResponse(response)).toThrow('Something went wrong');
    });
  });
  
  // Exercise 6 Tests
  describe('Exercise 6: somethingDangerous', () => {
    test('returns "all good" when random value is greater than 0.5', () => {
      // Mock Math.random to always return 0.6
      const mockRandom = jest.spyOn(Math, 'random').mockReturnValue(0.6);
      expect(somethingDangerous()).toBe('all good');
      mockRandom.mockRestore();
    });
  
    test('throws an error when random value is less than or equal to 0.5', () => {
      // Mock Math.random to always return 0.5
      const mockRandom = jest.spyOn(Math, 'random').mockReturnValue(0.5);
      expect(() => somethingDangerous()).toThrow('Something went wrong');
      mockRandom.mockRestore();
    });
  });
  
  // Exercise 7 Tests
  describe('Exercise 7: parseValue', () => {
    test('returns id when value has correct structure', () => {
      const value = { data: { id: '123' } };
      expect(parseValue(value)).toBe('123');
    });
  
    test('throws an error when value does not have correct structure', () => {
      const value = { data: { name: 'John' } };
      expect(() => parseValue(value)).toThrow('Parsing error!');
    });
  
    test('throws an error when value is null', () => {
      expect(() => parseValue(null)).toThrow('Parsing error!');
    });
  });
  
  // Exercise 8 & 9 Tests
  describe('Exercise 8 & 9: calculateArea and calculateArea2', () => {
    const squareShape: { kind: 'square', sideLength: number } = { kind: 'square', sideLength: 5 };
    const circleShape: { kind: 'circle', radius: number } = { kind: 'circle', radius: 3 };
  
    test('calculateArea calculates area correctly for square', () => {
      expect(calculateArea(squareShape)).toBe(25);
    });
  
    test('calculateArea calculates area correctly for circle', () => {
      expect(calculateArea(circleShape)).toBeCloseTo(28.27, 1);
    });
  
    test('calculateArea2 calculates area correctly for square', () => {
      expect(calculateArea2(squareShape)).toBe(25);
    });
  
    test('calculateArea2 calculates area correctly for circle', () => {
      expect(calculateArea2(circleShape)).toBeCloseTo(28.27, 1);
    });
  });
  
// Exercise 10 Tests
describe('Exercise 10: Discriminated Tuples', () => {
    test('returns users array on success', async () => {
      const [status, value] = await fetchDataMock(true);
      
      expect(status).toBe('success');
      
      // Type check (this would fail if our type isn't discriminated correctly)
      if (status === 'success') {
        // value should be User[]
        expect(Array.isArray(value)).toBe(true);
        expect(value[0]).toHaveProperty('id');
        expect(value[0]).toHaveProperty('name');
        expect(value[0]).toHaveProperty('email');
      }
    });
  
    test('returns error message on failure', async () => {
      const [status, value] = await fetchDataMock(false);
      
      expect(status).toBe('error');
      
      // Type check
      if (status === 'error') {
        // value should be string
        expect(typeof value).toBe('string');
        expect(value).toBe('An error occurred');
      }
    });
  
    test('discriminated tuple type narrows correctly', async () => {
      const response = await fetchDataMock(true);
      const [status, value] = response;
  
      if (status === 'success') {
        // In a real test, this would be a type assertion
        // Here we're just checking the runtime type
        expect(Array.isArray(value)).toBe(true);
      } else {
        expect(typeof value).toBe('string');
      }
    });
  });
  
  // Exercise 11 Tests
  describe('Exercise 11: Handling Defaults with Discriminated Union', () => {
    test('calculates area of a circle when kind is specified', () => {
      const shape = { kind: 'circle' as const, radius: 5 };
      const result = calculateAreaWithDefaults(shape);
      expect(result).toBeCloseTo(78.54, 2);
    });
  
    test('calculates area of a square when kind is specified', () => {
      const shape = { kind: 'square' as const, sideLength: 5 };
      const result = calculateAreaWithDefaults(shape);
      expect(result).toBe(25);
    });
  
    test('calculates area of a circle when no kind is passed', () => {
      const shape = { radius: 5 };
      const result = calculateAreaWithDefaults(shape);
      expect(result).toBeCloseTo(78.54, 2);
    });
  });