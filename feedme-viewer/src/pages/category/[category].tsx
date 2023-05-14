import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import Link from "next/link";

import { NavItem, Wrapper } from "~/components/Wrapper";
import { getLeftSideMenuItems } from "~/helper/leftSideMenuHelper";
import { stripPipeEscapes } from "~/helper/stringHelper";
import { EventName, mongoService, Subcategory } from "~/service/MongoService";

import categoryStyles from "~/pages/category/Category.module.css";
import p from "~/styles/p.module.css";

interface CategoryProps {
    events: Record<Subcategory, EventName[]>;
    category: string;
    leftSideMenuItems: NavItem[];
}

export async function getServerSideProps(
    context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CategoryProps>> {
    const category = context.query.category;
    let result: GetServerSidePropsResult<CategoryProps> = { notFound: true };

    if (category && !Array.isArray(category)) {
        const events = await (await mongoService).getEventsBySubcategory(category);

        if (Object.keys(events).length > 0) {
            result = { props: {
                events,
                category,
                leftSideMenuItems: await getLeftSideMenuItems(),
            } };
        }
    }

    return result;
}

export default function categoryPage({ events, category, leftSideMenuItems }: CategoryProps): JSX.Element {
    return (
        <Wrapper leftSideMenuItems={ leftSideMenuItems }>
            <h2 className={ categoryStyles.title }>{ category }</h2>
            { Object.entries(events).map(([subcategory, events]) => (
                <details key={ subcategory }>
                    <summary className={ categoryStyles.summary }>{ subcategory }</summary>
                    <div className={ categoryStyles.details }>
                        { events.map((name) => (
                            <p key={ name } className={ p.noPad }>
                                <Link
                                    href={ `/event/${encodeURI(stripPipeEscapes(name))}` }
                                    className={ categoryStyles.eventLink }
                                >
                                    { stripPipeEscapes(name) }
                                </Link>
                            </p>
                        )) }
                    </div>
                </details>
            )) }
        </Wrapper>
    );
}
