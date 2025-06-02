import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-neutral-900 mb-4">404</h1>
          <p className="text-xl text-neutral-600 mb-8">Page not found</p>
          <Button
            variant="primary"
            onClick={() => navigate('/')}
            leftIcon={<Home size={16} />}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;