import robot from 'robotjs';
export default {};

export const test = () => {
  robot.setMouseDelay(2);

  let twoPI = Math.PI * 2.0;
  let screenSize = robot.getScreenSize();
  let height = screenSize.height / 2 - 10;
  let width = screenSize.width;

  for (let x = 0; x < width; x++) {
    let y = height * Math.sin((twoPI * x) / width) + height;
    robot.moveMouse(x, y);
  }
};
