import Test from './component/module';

document.addEventListener('DOMContentLoaded', () => {
  const test = new Test();
  const state = test.initDocument();
  document.write(state.toString());
});
