import { hc } from 'hono/client'
import { type ApiRoutes } from "../../../server/app";

// using hono rpc client to fetch the total spent completely type safe from backend to frontend
const client = hc<ApiRoutes>('/')

export const api = client.api