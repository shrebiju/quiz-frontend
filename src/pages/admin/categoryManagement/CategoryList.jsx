import { Trash2, Edit } from 'lucide-react';
import ButtonCard from '../../../components/ButtonCard';
import NoDataFound from '../../../components/NoDataFound';
import LoadingSpinner from '../../../components/LoadingSpinner';

const CategoryList = ({ 
  categories, 
  loading, 
  onEdit, 
  onDeleteClick 
}) => {
  if (loading) return <LoadingSpinner />;
  if (categories.length === 0) return <NoDataFound message="No categories found. Add your first category!" />;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-xl font-semibold mb-4">Categories List</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
            <span className="font-medium">{category.name}</span>
            <div className="flex gap-2">
              <ButtonCard
                onClick={() => onEdit(category)}
                color="primary"
                size="small"
                className="p-2"
              >
                <Edit size={16} />
              </ButtonCard>
              <ButtonCard
                onClick={() => onDeleteClick(category.id)}
                color="danger"
                size="small"
                className="p-2"
              >
                <Trash2 size={16} />
              </ButtonCard>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;