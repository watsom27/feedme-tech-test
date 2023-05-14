import { NavItem } from "~/components/Wrapper";
import { mongoService } from "~/service/MongoService";

export async function getLeftSideMenuItems(): Promise<NavItem[]> {
    const mongo = await mongoService;
    const categories = await mongo.getCategories();

    return categories.map((category) => ({ display: category, url: `/category/${category}` }));
}
