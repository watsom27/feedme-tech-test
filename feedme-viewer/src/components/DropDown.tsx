import classNames from "classnames";
import { PropsWithChildren } from "react";

import dropDown from "~/components/DropDown.module.css";
import p from "~/styles/p.module.css";

interface DropDownProps {
    summaryText: string;
    summaryClassName?: string;
    contentsClassName?: string;
    open?: boolean;
    key?: string;
}

export function DropDown(
    {
        children,
        summaryText,
        summaryClassName,
        contentsClassName,
        open,
    }: PropsWithChildren<DropDownProps>,
): JSX.Element {
    return (
        <details open={ open }>
            <summary className={ classNames(dropDown.summary, summaryClassName) }>{ summaryText }</summary>
            <div className={ classNames(dropDown.details, contentsClassName) }>
                { children }
            </div>
        </details>
    );
}

interface DropDownItemProps {
    className?: string;
    key?: string;
}

export function DropDownItem({ children, className }: PropsWithChildren<DropDownItemProps>): JSX.Element {
    return (
        <p className={ classNames(dropDown.item, p.noMargin, className) }>
            { children }
        </p>
    );
}
