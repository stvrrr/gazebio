'use client';

import React, { useState } from 'react';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Link as LinkIcon, Plus, Trash2, GripVertical } from 'lucide-react';
import { UserProfile, Link as LinkType } from '@/types';
import { useProfileStore } from '@/store/profileStore';
import { addLink, updateLink, deleteLink } from '@/lib/db';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { generateId, isValidUrl } from '@/lib/utils';

interface LinkEditorProps {
  profile: UserProfile;
}

export const LinkEditor: React.FC<LinkEditorProps> = ({ profile }) => {
  const { user } = useAuth();
  const { addLink: storeAddLink, updateLink: storeUpdateLink, deleteLink: storeDeleteLink } = useProfileStore();
  const [newLink, setNewLink] = useState({ title: '', url: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateLink = (link: typeof newLink) => {
    const linkErrors: Record<string, string> = {};

    if (!link.title) linkErrors.title = 'Title is required';
    if (!link.url) linkErrors.url = 'URL is required';
    else if (!isValidUrl(link.url)) linkErrors.url = 'Invalid URL';

    return linkErrors;
  };

  const handleAddLink = async () => {
    const linkErrors = validateLink(newLink);
    setErrors(linkErrors);

    if (Object.keys(linkErrors).length > 0) return;
    if (!user) return;

    setIsLoading(true);
    try {
      const link: LinkType = {
        id: generateId(),
        title: newLink.title,
        url: newLink.url,
        clicks: 0,
        order: profile.links?.length || 0,
        createdAt: new Date().toISOString(),
      };

      await addLink(user.id, link);
      storeAddLink(link);
      setNewLink({ title: '', url: '' });
      setErrors({});
      toast.success('Link added!');
    } catch (error) {
      toast.error('Failed to add link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLink = async (linkId: string, updates: Partial<LinkType>) => {
    if (!user) return;

    try {
      await updateLink(user.id, linkId, updates);
      storeUpdateLink(linkId, updates);
      toast.success('Link updated!');
    } catch (error) {
      toast.error('Failed to update link');
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!user) return;

    try {
      await deleteLink(user.id, linkId);
      storeDeleteLink(linkId);
      toast.success('Link deleted!');
    } catch (error) {
      toast.error('Failed to delete link');
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <LinkIcon className="text-glow-purple" size={24} />
        <h3 className="text-lg font-semibold text-white">Links</h3>
        <span className="ml-auto text-sm text-glass-light">
          {profile.links?.length || 0} links
        </span>
      </div>

      {/* Add New Link */}
      <div className="mb-6 p-4 bg-glass-dark/50 rounded-lg border border-glass-light/10">
        <p className="text-sm font-medium text-glass-light mb-3">Add New Link</p>
        <div className="space-y-3 mb-3">
          <Input
            placeholder="Link Title"
            value={newLink.title}
            onChange={(e) => setNewLink((prev) => ({ ...prev, title: e.target.value }))}
            error={errors.title}
          />
          <Input
            placeholder="https://example.com"
            value={newLink.url}
            onChange={(e) => setNewLink((prev) => ({ ...prev, url: e.target.value }))}
            error={errors.url}
          />
        </div>
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          onClick={handleAddLink}
          isLoading={isLoading}
        >
          <Plus size={16} className="mr-2" />
          Add Link
        </Button>
      </div>

      {/* Links List */}
      <div className="space-y-2">
        {profile.links && profile.links.length > 0 ? (
          profile.links.map((link) => (
            <div
              key={link.id}
              className="flex items-center gap-3 p-3 bg-glass-dark/30 rounded-lg border border-glass-light/10 hover:border-glass-light/20 transition"
            >
              <GripVertical size={16} className="text-glass-light/50 cursor-grab" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{link.title}</p>
                <p className="text-xs text-glass-light/50 truncate">{link.url}</p>
              </div>
              <span className="text-xs text-glow-pink font-semibold whitespace-nowrap">
                {link.clicks || 0} clicks
              </span>
              <button
                onClick={() => handleDeleteLink(link.id)}
                className="text-glass-light/50 hover:text-red-400 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        ) : (
          <p className="text-center py-6 text-glass-light">No links yet. Add one above!</p>
        )}
      </div>
    </Card>
  );
};
