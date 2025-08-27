export interface Rating {
  _id: string;
  user: string;
  value: number;
  createdAt: string;
  updatedAt: string;
}

export interface Reply {
  _id: string;
  user: string;
  text: string;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  user: string;
  text: string;
  likes: string[];
  replies: Reply[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductReviews {
  ratings: Rating[];
  comments: Comment[];
  averageRating: number;
  totalRatings: number;
  totalComments: number;
}