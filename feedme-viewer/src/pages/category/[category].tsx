import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import Link from "next/link";
import { useState } from "react";

import { DropDown, DropDownItem } from "~/components/DropDown";
import { FancyTitle } from "~/components/FancyTitle";
import { Refresh } from "~/components/Refresh";
import { Wrapper, WrapperProps } from "~/components/Wrapper";
import { getLeftSideMenuItems } from "~/helper/leftSideMenuHelper";
import { stripPipeEscapes } from "~/helper/stringHelper";
import { EventView, mongoService, Subcategory } from "~/service/MongoService";

import categoryStyles from "~/pages/category/Category.module.css";

interface CategoryProps extends WrapperProps {
    events: Record<Subcategory, EventView[]>;
    category: string;
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
    const [eventsData, setEventsData] = useState(events);

    const refresh = async () => {
        const response = await fetch(`/api/v1/category/${category}`);

        if (response.ok) {
            setEventsData(await response.json());
        } else {
            console.error(await response.text());
        }
    };

    return (
        <Wrapper leftSideMenuItems={ leftSideMenuItems }>
            <FancyTitle>{ category }</FancyTitle>
            <Refresh onClick={ refresh } />
            { Object.entries(eventsData).map(([subcategory, events]) => (
                <DropDown key={ subcategory } summaryText={ subcategory }>
                    { events
                        .map(({ eventId, name }) => (
                            <DropDownItem key={ eventId }>
                                <Link
                                    href={ `/event/${eventId}` }
                                    className={ categoryStyles
                                        .eventLink }
                                >
                                    { stripPipeEscapes(name) }
                                </Link>
                            </DropDownItem>
                        )) }
                </DropDown>
            )) }
        </Wrapper>
    );
}
