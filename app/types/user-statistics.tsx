export type UserStatistics = {
  user_id: number;
  username: string;
  total_reviews: number;
  total_likes_given: number;
  total_likes_received: number;
  following_count: number;
  followers_count: number;
  average_rating: number | null; //null se o usuário não tiver reviews
  total_lists: number;
};
