import { defineAgent } from '@standardagents/spec';

export default defineAgent({
  name: 'curator',
  maxSessionTurns: 6,
  sideA: { prompt: 'curator', stopOnResponse: true, maxSteps: 5 },
  sideB: { human: true },
});
