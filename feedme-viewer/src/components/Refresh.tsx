import classNames from "classnames";
import { PropsWithChildren, useState } from "react";

import refresh from "~/components/Refresh.module.css";

interface RefreshProps {
    onClick: () => Promise<void>;
    className?: string;
}

export function Refresh({ children, onClick, className }: PropsWithChildren<RefreshProps>): JSX.Element {
    const [inProgress, setInProgress] = useState(false);

    const actualOnClick = async () => {
        setInProgress(true);
        await onClick();
        setInProgress(false);
    };

    return (
        <span className={ refresh.wrapper }>
            <button
                onClick={ actualOnClick }
                className={ classNames({
                    className: className,
                    [refresh.button]: true,
                    [refresh.inProgress]: inProgress,
                }) }
            >
                { children ?? "Refresh" }
            </button>
        </span>
    );
}
