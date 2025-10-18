"use client";

import { useState } from "react";
import { ru, enUS } from "date-fns/locale";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Heart, Trash2, Send, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
    useComments,
    useCreateComment,
    useReplyToComment,
    useDeleteComment,
    useLikeComment,
    useUnlikeComment,
} from "@/hooks/useComments";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "./UserAvatar";
import { Comment } from "@/types";

export const CommentSection = ({ publicationId }: { publicationId: string }) => {
    const { data: comments, isLoading } = useComments(publicationId);
    const createComment = useCreateComment();
    const replyToComment = useReplyToComment();
    const deleteComment = useDeleteComment();
    const likeComment = useLikeComment();
    const unlikeComment = useUnlikeComment();

    const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
    const [text, setText] = useState("");

    const locale =
        typeof window !== "undefined"
            ? localStorage.getItem("locale") || "en"
            : "en";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        if (replyTo) {
            replyToComment.mutate({ commentId: replyTo.id, text });
            setReplyTo(null);
        } else {
            createComment.mutate({ publicationId, text });
        }

        setText("");
    };

    const handleLikeToggle = (comment: Comment) => {
        if (comment.isLiked) unlikeComment.mutate(comment.id);
        else likeComment.mutate(comment.id);
    };

    const handleDelete = (commentId: string) => {
        deleteComment.mutate(commentId);
    };

    const renderComment = (comment: Comment, depth = 0) => (
        <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={`w-full ${depth > 0 ? "mt-3" : "mt-4"}`}
        >
            <Card className={`group hover:shadow-md transition-shadow duration-200 ${depth > 0 ? "bg-muted/20" : ""
                }`}>
                <CardContent className="px-4">
                    <div className="flex items-start gap-3">
                        <UserAvatar {...comment.author} />

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-sm truncate">
                                        {comment.author?.fullname}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(comment.createdAt), {
                                            addSuffix: true,
                                            locale: locale === "ru" ? ru : enUS,
                                        })}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <motion.div whileTap={{ scale: 0.9 }}>
                                        <button
                                            onClick={() => handleLikeToggle(comment)}
                                            className="h-8 w-8 rounded-full bg-none hover:bg-transparent"
                                        >
                                            <motion.div
                                                animate={{
                                                    scale: comment.isLiked ? [1, 1.3, 1] : 1,
                                                }}
                                                transition={{ duration: 0.3 }}
                                                className="flex items-center justify-center gap-1 secondary-text"
                                            >
                                                <Heart
                                                    className={`h-4 w-4 transition-colors ${comment.isLiked
                                                        ? "text-red-500 fill-red-500"
                                                        : "text-muted-foreground"
                                                        }`}
                                                />
                                                <span>{comment.likeCount}</span>
                                            </motion.div>
                                        </button>
                                    </motion.div>

                                    <motion.div whileTap={{ scale: 0.9 }}>
                                        <button
                                            onClick={() =>
                                                setReplyTo({
                                                    id: comment.id,
                                                    name: comment.author?.fullname,
                                                })
                                            }
                                            className="flex items-center justify-center h-8 w-8 rounded-full bg-none hover:bg-transparent secondary-text gap-1"
                                        >
                                            <MessageCircle className="h-4 w-4 text-muted-foreground" />
                                            <span>{comment.replies?.length}</span>
                                        </button>
                                    </motion.div>

                                    {comment.author && (
                                        <motion.div whileTap={{ scale: 0.9 }}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(comment.id)}
                                                className="h-8 w-8 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500 hover:text-red-500" />
                                            </Button>
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            <p className="text-sm mt-2 leading-relaxed break-words">
                                {comment.text}
                            </p>

                            {comment.replies?.length! > 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-3 pl-4 border-l-2 border-border space-y-2"
                                >
                                    {comment.replies!.map((reply: any) =>
                                        renderComment(reply, depth + 1)
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );

    return (
        <section className="flex flex-col h-screen w-full bg-background">
            <div className="p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <h3 className="text-lg font-semibold">Комментарии</h3>
                <p className="text-sm text-muted-foreground mt-1">
                    {comments?.length || 0} {comments?.length === 1 ? "комментарий" : "комментариев"}
                </p>
            </div>

            <ScrollArea className="flex-1 px-4">
                <div className="py-4">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <Card key={i}>
                                    <CardContent className="p-4">
                                        <div className="flex gap-3">
                                            <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton className="h-4 w-24" />
                                                <Skeleton className="h-3 w-16" />
                                                <Skeleton className="h-12 w-full mt-2" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : comments?.length ? (
                        <AnimatePresence>
                            {comments.map((c: any) => renderComment(c))}
                        </AnimatePresence>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center py-12"
                        >
                            <MessageCircle className="h-12 w-12 text-muted-foreground/50 mb-3" />
                            <p className="text-sm text-muted-foreground text-center">
                                Пока нет комментариев — будь первым!
                            </p>
                        </motion.div>
                    )}
                </div>
                <div className="h-24" />
            </ScrollArea>

            <div className="backdrop-blur-3xl supports-[backdrop-filter]:bg-background/60 p-4 sticky bottom-0 z-50">
                <AnimatePresence>
                    {replyTo && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-3 overflow-hidden"
                        >
                            <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border">
                                <MessageCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-sm text-muted-foreground flex-1 truncate">
                                    Ответ для <span className="font-medium">{replyTo.name}</span>
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setReplyTo(null)}
                                    className="h-6 w-6 rounded-full flex-shrink-0"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center gap-2">
                    <Input
                        placeholder={
                            replyTo
                                ? "Напишите ответ..."
                                : "Напишите комментарий..."
                        }
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        className="flex-1 h-11"
                    />
                    <motion.div whileTap={{ scale: 0.95 }}>
                        <Button
                            onClick={handleSubmit}
                            disabled={createComment.isPending || replyToComment.isPending || !text.trim()}
                            className="h-11 btn-login"
                        >
                            <Send className="size-4" />
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};