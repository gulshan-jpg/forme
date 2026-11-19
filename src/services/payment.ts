/** Payment provider interface. Replace the simulated providers with a Razorpay test-mode provider later. */
export interface PaymentResult{ok:boolean;reference:string;label:string}
export interface PaymentProvider{id:string;label:string;pay:(amount:number)=>Promise<PaymentResult>}
const sim=(id:string,label:string):PaymentProvider=>({id,label,pay:async()=>{await new Promise(r=>setTimeout(r,900));return {ok:true,reference:'SIM-'+Date.now(),label:label+' (simulated, no money charged)'}}})
export const providers:PaymentProvider[]=[sim('upi','UPI'),sim('card','Card'),sim('cod','Cash on Delivery')]
