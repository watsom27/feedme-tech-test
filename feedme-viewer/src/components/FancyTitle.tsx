import classNames from "classnames";
import { PropsWithChildren } from "react";

import fancyTitle from "~/components/FancyTitle.module.css";

interface FancyTitleProps {
    className?: string;
}

export function FancyTitle({ children, className }: PropsWithChildren<FancyTitleProps>): JSX.Element {
    return <h2 className={ classNames(fancyTitle.title, className) }>{ children }</h2>;
}
