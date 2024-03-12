import { Home, Store, Users, ShoppingBag, BarChart4, Mail, MessageSquare, Settings, LogOut, Archive, SquareStack, TagsIcon, ArrowRightLeft } from 'lucide-react'
import { ParsedQuery } from 'query-string'

export const sidebarIcons = [
    {
        Icon: Home,
        name: 'Dashboard',
        link: '/admin/dashboard'
    },
    {   
        Icon: Store,
        name: 'E-commerce', 
        subLinks: [
            {
                Icon: Archive,
                name: 'Products',
                link: '/admin/products',
            },
            {
                Icon: SquareStack,
                name: 'Categories',
                link: '/admin/products/categories'
            },
            {
                Icon: TagsIcon,
                name: 'Brands',
                link: '/admin/products/brands'
            },
        ]
    },
    {
        Icon: ArrowRightLeft,
        name: 'Expenses Manager',
        link: '/admin/expenses-manager'
    },
    {
        Icon: Users,
        name: 'Customers',
        link: '/admin/customers'
    },
    {
        Icon: ShoppingBag,
        name: 'Orders',
        link: '/admin/orders'
    },
    {
        Icon: BarChart4,
        name: 'Analytics',
        link: '/admin/analytics'
    },
    {
        Icon: Mail,
        name: 'Mail',
        link: '/admin/mail'
    },
    {
        Icon: MessageSquare,
        name: 'Chats',
        link: '/admin/chats'
    },
    {
        Icon: Settings,
        name: 'Settings',
        link: '/admin/settings'
    },
    {
        Icon: LogOut,
        name: 'Back to client app',
        link: '/'
    }
]

export const handleQueries = (queryStr: ParsedQuery<string>) => {
    let currentQueriesStr = ''
    const queriesArray = Object.keys(queryStr).map(key => {
        return {
            key: key,
            value: queryStr[key]
        }
    })
    queriesArray.forEach((query, index) => {
        currentQueriesStr += `${index === 0 ? '?' : ''}${query.key}=${query.value}${queriesArray.length - 1 !== index ? '&' : ''}`
    })
    return currentQueriesStr
}

export const rupiahFormat = (amount: number) => {
    return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(amount)
}

export const condition = [
    {
        value: 'baru',
        name: 'New'
    },
    {
        value: 'bekas',
        name: 'Second hand'
    }
]

export const sorting = [
    {
        name: 'New product',
        value: 'newest-product'
    },
    {
        name: 'Old product',
        value: 'oldest-product'
    },
    {
        name: 'Lowest price',
        value: 'by-lowest-price'
    },
    {
        name: 'Highest price',
        value: 'by-highest-price'
    },
    {
        name: 'Discount price',
        value: 'by-discount'
    }
]

export const defaultProfilePhoto = (username: string): string => `https://ui-avatars.com/api?format=svg&bold=true&name=${username?.slice(0, 2)}`