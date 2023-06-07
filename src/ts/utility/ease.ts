import gsap from 'gsap';
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);
export const easeInQuad = CustomEase.create("easeInQuad", "0.55, 0.085, 0.68, 0.53");
export const easeOutQuad = CustomEase.create("easeOutQuad", "0.25, 0.46, 0.45, 0.94");
export const easeInOutQuad = CustomEase.create("easeInOutQuad", "0.455, 0.03, 0.515, 0.955");
export const easeInQuart = CustomEase.create("easeInQuart", "0.895, 0.03, 0.685, 0.22");
export const easeOutQuart = CustomEase.create("easeOutQuart", "0.165, 0.84, 0.44, 1");
export const easeInOutQuart = CustomEase.create("easeInOutQuart", "0.77, 0, 0.175, 1");
export const easeInQuint = CustomEase.create("easeInQuint", "0.755, 0.05, 0.855, 0.06");
export const easeOutQuint = CustomEase.create("easeOutQuint", "0.23, 1, 0.32, 1");
export const easeInOutQuint = CustomEase.create("easeInOutQuint", "0.86, 0, 0.07, 1");
export const easeInSine = CustomEase.create("easeInSine", "0.47, 0, 0.745, 0.715");
export const easeOutSine = CustomEase.create("easeOutSine", "0.39, 0.575, 0.565, 1");
export const easeInOutSine = CustomEase.create("easeInOutSine", "0.445, 0.05, 0.55, 0.95");
export const easeInExpo = CustomEase.create("easeInExpo", "0.95, 0.05, 0.795, 0.035");
export const easeOutExpo = CustomEase.create("easeOutExpo", "0.19, 1, 0.22, 1");
export const easeInOutExpo = CustomEase.create("easeInOutExpo", "1, 0, 0, 1");
export const easeInCirc = CustomEase.create("easeInCirc", "0.6, 0.04, 0.98, 0.335");
export const easeOutCirc = CustomEase.create("easeOutCirc", "0.075, 0.82, 0.165, 1");
export const easeInOutCirc = CustomEase.create("easeInOutCirc", "0.785, 0.135, 0.15, 0.86");
export const easeInBack = CustomEase.create("easeInBack", "0.6, -0.28, 0.735, 0.045");
export const easeOutBack = CustomEase.create("easeOutBack", "0.175, 0.885, 0.32, 1.275");
export const easeInOutBack = CustomEase.create("easeInOutBack", "0.68, -0.55, 0.265, 1.55");
export const easeInCubic = CustomEase.create("easeInCubic", "0.55, 0.055, 0.675, 0.19");
export const easeOutCubic = CustomEase.create("easeOutCubic", "0.215, 0.61, 0.355, 1");
export const easeInOutCubic = CustomEase.create("easeInOutCubic", "0.645, 0.045, 0.355, 1");

