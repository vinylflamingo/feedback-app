<template>
    <div v-for="parent_comment in props.comments">
        {{ parent_comment.user_id }}
        {{ parent_comment.text }}
        <p>children</p>
        <div v-for="child_comment in parent_comment.children">
            {{ child_comment.user_id }}
            {{ child_comment.text }}
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Comment } from '~/types';

interface CommentsSectionProps {
    comments: Comment[]
}


const props = defineProps<CommentsSectionProps>()
</script>