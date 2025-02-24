type rectangleTypes = {
    width: number;
    height: number;
}
const getRectangleArea = (rectangle:rectangleTypes) => {
    return rectangle.width * rectangle.height;
  };
  
  const getRectanglePerimeter = (rectangle: rectangleTypes) => {
    return 2 * (rectangle.width + rectangle.height);
  };