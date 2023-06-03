import Hashids from "hashids";

const hashids = new Hashids()


export const encodeWidgetId = (id: number | bigint) => {
  return hashids.encode(id)
}

export const decodeWidgetId = (id: string) => {
  return hashids.decode(id);
}