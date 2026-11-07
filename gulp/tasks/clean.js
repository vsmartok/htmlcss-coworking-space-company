import { deleteAsync } from "del";
import { paths } from "../paths.js";

export function clean() {
  return deleteAsync(paths.build);
}
