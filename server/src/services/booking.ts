export type BookingWindow={resourceId:string;startAt:Date;endAt:Date};
export type ExistingBooking=BookingWindow & {status:string};
export function hasBookingConflict(candidate:BookingWindow,existing:ExistingBooking[]):boolean{return existing.some(item=>item.resourceId===candidate.resourceId&&['PENDING','APPROVED'].includes(item.status)&&candidate.startAt<item.endAt&&candidate.endAt>item.startAt)}
export type ApprovalDecision={status:'PENDING'|'APPROVED'|'REJECTED';currentStep:number;stepCount:number};
export function applyApproval(decision:ApprovalDecision,action:'APPROVE'|'REJECT'):ApprovalDecision{if(decision.status!=='PENDING')throw new Error('Booking is no longer pending');if(action==='REJECT')return {...decision,status:'REJECTED'};if(decision.currentStep+1>=decision.stepCount)return {...decision,status:'APPROVED',currentStep:decision.currentStep+1};return {...decision,currentStep:decision.currentStep+1}}
