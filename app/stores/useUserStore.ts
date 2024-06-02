// store/auth.ts
import { defineStore } from 'pinia'
import { USER_API_CALLS } from '~/constants/api-calls';
import { UserApi } from '~/constants/enums';
import type { Comment } from '~/types';
import { type User } from '~/types/User';

export const useUserStore = defineStore('user', () => {
    const user: UserStore = reactive<UserStore>({
        id: NaN,
        username: '',
        profilePicture: '',
        role: '',
        suggestions: [],
        comments: [],
        upvotes: []
    })

    const getUpvotes = computed(() => user.upvotes)
    const getComments = computed(() => user.comments)
    const getSuggestions = computed(() => user.suggestions)

    /* toggle id add and removal fromt store by passing the ID and the get functions */

    function updateStore(id: number, content: number[]) {
        const index = content.indexOf(id);
        if (index !== -1) {
            content.splice(index, 1);
        } else {
            content.push(id);
        }
    }

    async function refreshStore() {
        const { data, error }  = await useAsyncData<User>('user-store', async () => {
            return await USER_API_CALLS[UserApi.USER_INFO]();
        });

        if (data) {
            console.log("USER STORE REFRESH: ",data)
            user.id = data.value?.id || NaN,
            user.username = data.value?.username || '',
            user.profilePicture = data.value?.profilePicture || '',
            user.role = data.value?.role || 'member',
            user.suggestions = data.value?.suggestions.map(x => x.id) || [],
            user.comments = getAllCommentIds(data.value?.comments) || [],
            user.upvotes = data.value?.upvotes.filter(x => x.active === true).map(x => x.suggestion_id) || []

        } else {
            console.log(error)
        }
    }

    return {
        refreshStore,
        updateStore,
        getUpvotes,
        getComments,
        getSuggestions,
        user
    }
})






function getAllCommentIds(comments: Comment[]| undefined): number[] {
    if (comments === undefined) {
        return [];
    } else {
        const ids = new Set<number>();
        function traverse(comments: Comment[]): void {
            comments.forEach(comment => {
                ids.add(comment.id);
                if (comment.children && comment.children.length > 0) {
                    traverse(comment.children);
                }
            });
        }
    
        traverse(comments);
        return Array.from(ids);
    }
}

interface UserStore {
    id: number,
    username: string, 
    profilePicture: string, 
    role: string,
    suggestions: number[],
    comments: number[],
    upvotes: number[]
}


