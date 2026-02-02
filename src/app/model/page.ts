import { Film } from "./film";
import { PageMeta } from "./page-meta";

export interface Page {
    content: Film[];
    page: PageMeta;
}
