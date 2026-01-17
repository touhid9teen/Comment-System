
import { Dropdown } from '../ui/Dropdown';
import type { CommentType, SortOption } from '../../types/index';
import './comment-section.scss';
import { useState } from 'react';

// Mock initial data
const MOCK_COMMENTS: CommentType[] = [
  {
    id: '1',
    userId: 'u2',   
    user: { id: 'u2', name: 'Mitu Aktar', avatarUrl: '', email: 'mitu@example.com' },
    content: 'Un komon সত্যি ই আমারও....',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 1w ago
    parentId: null,
    likes: ['u1', 'u3'],
    dislikes: [],
    replies: []
  },
  {
    id: '2',
    userId: 'u3',
    user: { id: 'u3', name: 'Mahi Bai', avatarUrl: '', email: 'mahi@example.com' },
    content: 'Un Komon alhamdulillah',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // 2w ago
    parentId: null,
    likes: ['u2'],
    dislikes: [],
    replies: [
        {
            id: '2-1',
            userId: 'u4',
            user: { id: 'u4', name: 'Nested User', avatarUrl: '', email: 'nested@e.com'},
            content: 'This is a reply',
            createdAt: new Date().toISOString(),
            parentId: '2',
            likes: [],
            dislikes: [],
            replies: []
        }
    ]
  }
];

  const sortOptions = [
      { label: 'Most Relevant', value: 'most-liked' },
      { label: 'Newest', value: 'newest' },
      { label: 'Most Disliked', value: 'most-disliked' },
  ];

export const CommentSection: React.FC = () => {
 const [sortOption, setSortOption] = useState<SortOption>('newest'); 

  return (
    <div className="comment-section">
      <div className="comment-section__header">
        <h3>Comments</h3>
        <Dropdown 
          items={sortOptions} 
          selected={sortOption} 
          onSelect={(val) => setSortOption(val as SortOption)} 
          label="Sort by"
        />
      </div>

    </div>
  );
};
