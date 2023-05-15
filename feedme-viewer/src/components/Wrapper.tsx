import classNames from "classnames";
import classnames from "classnames";
import Link from "next/link";
import { PropsWithChildren, useState } from "react";

import { Refresh } from "~/components/Refresh";

import wrapper from "~/components/Wrapper.module.css";
import a from "~/styles/a.module.css";
import p from "~/styles/p.module.css";

export const intoNavItem = (category: string): NavItem => ({ display: category, url: `/category/${category}` });

export interface NavItem {
    icon?: string;
    display: string;
    url: string;
}

export interface WrapperProps {
    leftSideMenuItems: NavItem[];
}

export function Wrapper({ children, leftSideMenuItems }: PropsWithChildren<WrapperProps>): JSX.Element {
    const [lsmItems, setLsmItems] = useState(leftSideMenuItems);

    const refresh = async () => {
        const response = await fetch("/api/v1/categories");

        if (response.ok) {
            const categories: string[] = await response.json();

            setLsmItems(categories.map(intoNavItem));
        } else {
            console.error(await response.text());
        }
    };

    return (
        <main className={ wrapper.main }>
            <header className={ wrapper.header }>
                <Link href="/" className={ a.white }>FeedMe Bet</Link>
            </header>
            <div className={ wrapper.contentWrapper }>
                <section className={ classnames(wrapper.sideMenu, wrapper.leftMenu) }>
                    <Refresh onClick={ refresh } />
                    <ul className={ wrapper.categoryList }>
                        { lsmItems.map((item) => (
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
