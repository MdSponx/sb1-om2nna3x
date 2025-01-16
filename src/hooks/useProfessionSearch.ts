import { useState, useCallback, useEffect } from 'react';
import { Department, SearchResult } from '../types/profession';
import { initializeProfessionData, searchProfessions } from '../lib/professions/data';
import { useDebounce } from './useDebounce';

export function useProfessionSearch() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const debouncedQuery = useDebounce(query, 300);

  // Initialize data
  useEffect(() => {
    try {
      const { departments } = initializeProfessionData();
      setDepartments(departments);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle search
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setLoading(true);
      const searchResults = searchProfessions(debouncedQuery, departments);
      setResults(searchResults);
      setLoading(false);
    } else {
      setResults([]);
    }
  }, [debouncedQuery, departments]);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
  }, []);

  return {
    query,
    results,
    loading,
    error,
    handleSearch,
    clearSearch
  };
}