'use server';

/**
 * @fileOverview An AI agent to optimize delivery routes for water delivery service.
 *
 * - optimizeDeliveryRoutes - A function that optimizes delivery routes.
 * - OptimizeDeliveryRoutesInput - The input type for the optimizeDeliveryRoutes function.
 * - OptimizeDeliveryRoutesOutput - The return type for the optimizeDeliveryRoutes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeDeliveryRoutesInputSchema = z.object({
  deliveries: z.array(
    z.object({
      orderId: z.string().describe('The ID of the order.'),
      address: z.string().describe('The delivery address.'),
      timeWindowStart: z.string().describe('The start of the delivery time window (e.g., 09:00).'),
      timeWindowEnd: z.string().describe('The end of the delivery time window (e.g., 17:00).'),
    })
  ).describe('A list of deliveries to be optimized.'),
  depotAddress: z.string().describe('The address of the depot where the deliveries start and end.'),
});

export type OptimizeDeliveryRoutesInput = z.infer<typeof OptimizeDeliveryRoutesInputSchema>;

const OptimizeDeliveryRoutesOutputSchema = z.object({
  optimizedRoutes: z.array(
    z.object({
      route: z.array(
        z.object({
          orderId: z.string().describe('The ID of the order in this stop.'),
          address: z.string().describe('The delivery address for this stop.'),
          timeWindowStart: z.string().describe('The start of the delivery time window.'),
          timeWindowEnd: z.string().describe('The end of the delivery time window.'),
        })
      ).describe('The optimized route for a delivery driver.'),
    })
  ).describe('A list of optimized routes for each delivery driver.'),
});

export type OptimizeDeliveryRoutesOutput = z.infer<typeof OptimizeDeliveryRoutesOutputSchema>;

export async function optimizeDeliveryRoutes(input: OptimizeDeliveryRoutesInput): Promise<OptimizeDeliveryRoutesOutput> {
  return optimizeDeliveryRoutesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeDeliveryRoutesPrompt',
  input: {schema: OptimizeDeliveryRoutesInputSchema},
  output: {schema: OptimizeDeliveryRoutesOutputSchema},
  prompt: `You are a route optimization expert. Given a list of water delivery orders, their addresses, and delivery time windows, create optimized delivery routes starting and ending at the depot address.

  Deliveries:
  {{#each deliveries}}
  - Order ID: {{this.orderId}}, Address: {{this.address}}, Time Window: {{this.timeWindowStart}} - {{this.timeWindowEnd}}
  {{/each}}

  Depot Address: {{depotAddress}}

  Output the optimized routes as a JSON object.
  `,
});

const optimizeDeliveryRoutesFlow = ai.defineFlow(
  {
    name: 'optimizeDeliveryRoutesFlow',
    inputSchema: OptimizeDeliveryRoutesInputSchema,
    outputSchema: OptimizeDeliveryRoutesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

