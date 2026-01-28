/** User model (dashboard + localStorage); email is unique key */
export interface User {
  id: string;
  name: string;
  email: string;
  itemsPurchased: number;
}
