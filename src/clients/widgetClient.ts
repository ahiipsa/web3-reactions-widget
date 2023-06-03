import axios from 'axios'
import {config} from "../config";

const base = axios.create({
  baseURL: config.widgetClient.host,
  withCredentials: true,
})

export interface Reaction {
  emojiId: number,
  counter: number,
}

export interface Widget {
  id: string;
  type: string;
  reactions: Reaction[],
  reaction: Reaction | undefined
}

export const widgetClient = {
  createWidget: async (type: "inline-react" | "inline-react-single") => {
    const response = await base.post<{data: Widget}>(`/notion/widgets/`, {type});
    return response.data.data;
  },

  loadWidgetList: async () => {
    const response = await base.get<{data: Widget[]}>(`/notion/widgets/`);
    return response.data.data;
  },

  createReaction: (widgetId: string, data: {emojiId: number}) => {
    const {emojiId} = data;

    return base.post(`/notion/widgets/${widgetId}`, {emojiId});
  },

  loadWidget: async (widgetId: string) => {
    const response = await base.get<{data: Widget}>(`/notion/widgets/${widgetId}`);

    return response.data.data;
  }
}