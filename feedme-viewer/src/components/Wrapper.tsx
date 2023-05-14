import classNames from "classnames";
import classnames from "classnames";
import Link from "next/link";
import { PropsWithChildren } from "react";

import wrapper from "~/components/Wrapper.module.css";
import p from "~/styles/p.module.css";

export interface NavItem {
    icon?: string;
    display: string;
    url: string;
}

interface WrapperProps {
    leftSideMenuItems: NavItem[];
}

export function Wrapper({ children, leftSideMenuItems }: PropsWithChildren<WrapperProps>): JSX.Element {
    return (
        <main className={ wrapper.main }>
            <header className={ wrapper.header }>
                <Link href="/">FeedMe Bet</Link>
            </header>
            <div className={ wrapper.contentWrapper }>
                <section className={ classnames(wrapper.sideMenu, wrapper.leftMenu) }>
                    <ul className={ wrapper.categoryList }>
                        { leftSideMenuItems.map((item) => (
                            <li key={ item.display } className={ wrapper.category }>
                                <Link
                                    href={ item.url }
                                    className={ wrapper.categoryLink }
                                >
                                    { item.display }
                                </Link>
                            </li>
                        )) }
                    </ul>
                </section>
                <section className={ wrapper.content }>
                    { children }
                </section>
                <section className={ classnames(wrapper.sideMenu, wrapper.rightMenu) }>
                    <span className={ wrapper.betSlipTitle }>
                        <p className={ classNames(wrapper.betCount) }>0</p>
                        <p className={ classNames(wrapper.myBetSlip, p.noPad) }>My Bet Slip</p>
                    </span>

                    <p>You have no selections in your bet slip</p>
                </section>
            </div>
        </main>
    );
}
