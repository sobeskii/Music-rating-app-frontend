import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/home/Home.vue'
import ShowArtist from '../views/artist/ShowArtist.vue'
import Search from "@/views/search/Search";
import ShowRelease from "@/views/release/ShowRelease";
import ShowReaction from "@/views/user/ShowReaction";
import ShowRatings from "@/views/user/ShowRatings";
import ShowProfile from "@/views/user/ShowProfile";
import ShowChart from "@/views/release/ShowChart";
import ShowAdmin from "@/views/admin/ShowAdmin";
import NotFound from "@/components/customcomponents/NotFound";
import ShowFlaggedReviews from "@/views/admin/ShowFlaggedReviews";
import ShowRules from "@/views/admin/ShowRules";
import ShowRecommendations from "@/views/user/ShowRecommendations";

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
        meta: {
            title: 'Home'

        }
    },
    {
        path: '/search',
        name: 'search',
        component: Search,
        meta: {
            title: 'Search'
        }
    },
    {
        path: '/artist/:id',
        name: 'artist',
        component: ShowArtist,
        meta: {
            title: 'Artist'
        }
    },
    {
        path: '/release/:id',
        name: 'release',
        component: ShowRelease,
        meta: {
            title: 'Release'
        }
    },
    {
        path: '/profile/:id/reactions',
        name: 'user_reactions',
        component: ShowReaction,
        meta: {
            title: 'Reactions',
        },
    },
    {
        path: '/profile/:id/ratings',
        name: 'user_ratings',
        component: ShowRatings,
        meta: {
            title: 'Ratings',
        }
    },
    {
        path: '/profile/:id',
        name: 'user_profile',
        component: ShowProfile,
        meta: {
            title: 'Profile',
        }
    },
    {
        path: '/charts',
        name: 'charts',
        component: ShowChart,
        meta: {
            title: 'Charts'
        }
    },
    {
        path: '/admin',
        name: 'admin',
        component: ShowAdmin,
        meta: {
            title: 'Dashboard',
            requiresAdmin: true,
        }
    },
    {
        path: '/admin/flagged',
        name: 'flagged',
        component: ShowFlaggedReviews,
        meta: {
            title: 'Flagged reviews',
            requiresAdmin: true,
        }
    },
    {
        path: '/admin/rules',
        name: 'rules',
        component: ShowRules,
        meta: {
            title: 'Review rules',
            requiresAdmin: true,
        }
    },
    {
        path: '/discover',
        name: 'discover',
        component: ShowRecommendations,
        meta: {
            title: 'Recommendations',
        },
    },
    {
        meta: { title: "Not found"},
        path: '/:pathMatch(.*)*',
        component: NotFound
    },
    {
        path: '/404', name: 'NotFound', component: NotFound, meta: {title: "Not found"}
    },
]

const router = createRouter({
    history: createWebHistory('/'),
    routes
})

export default router
