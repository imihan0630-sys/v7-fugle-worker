// Research-only D01 pure descriptor helpers. No Formal wiring.
export const signedDistance=(price,boundary,direction)=>direction==="DOWN"?Number(boundary)-Number(price):Number(price)-Number(boundary);
export function breakoutEpisodeId(x){return [x.symbol,x.semanticSpaceId,x.boundaryId,x.boundaryVersion,x.direction,x.firstConfirmedBreakAt].join("|");}
export function breakoutClocks(rows){
 let eligible=0,observable=0,constrained=0;
 for(const r of rows){if(!r.symbolSessionEligible)continue;eligible++;if(r.priceLimitConstrained)constrained++;else observable++;}
 return {eligibleBarsSinceBreak:eligible,observableBarsSinceBreak:observable,constrainedBarsSinceBreak:constrained};
}
