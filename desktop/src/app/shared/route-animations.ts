import {
  style,
  trigger,
  transition,
  query,
  animateChild,
  group,
  animate,
} from "@angular/animations";

const slideTo = (direction: string) => {
  const optional = { optional: true };
  return [
    style({ position: "relative", overflow: "hidden" }),
    query(
      ":enter, :leave",
      [
        style({
          position: "absolute",
          overflow: "hidden",
          [direction]: 0,
          width: "100%",
          height: "100%",
        }),
      ],
      optional
    ),
    query(":enter", [style({ [direction]: "-100%" })]),
    query(":leave", animateChild()),
    group([
      query(":leave", [
        animate("300ms ease-in-out", style({ [direction]: "100%" })),
      ]),
      query(":enter", [
        animate("300ms ease-in-out", style({ [direction]: "0%" })),
      ]),
    ]),
    query(":enter", animateChild()),
  ];
};

export const slideAnimation = trigger("routeAnimations", [
  transition(
    "middle => right-1, right-1 => right-2, right-2 => right-3",
    slideTo("right")
  ),
  transition(
    "right-3 => right-2, right-2 => right-1, right-1 => middle",
    slideTo("left")
  ),
  // transition("* => middle", slideTo("left")),
  // transition("right => left", slideTo("left")),
  // transition("left => bottom", slideTo("bottom")),
  // transition("right => bottom", slideTo("bottom")),
  // transition("bottom => right", slideTo("top")),
  // transition("bottom => left", slideTo("top")),
]);
