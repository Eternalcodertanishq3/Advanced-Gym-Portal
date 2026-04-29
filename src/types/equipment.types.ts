// Equipment related types - assuming some custom ones if model doesn't exist yet, 
// or maybe from other parts of schema. We'll stub it.
export interface Equipment {
  id: string;
  name: string;
  category: string;
  status: string;
  lastMaintenance: Date;
  nextMaintenance: Date;
}