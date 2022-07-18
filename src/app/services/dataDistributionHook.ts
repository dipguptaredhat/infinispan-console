import { useState, useEffect } from 'react';
import { ConsoleServices } from '@services/ConsoleServices';

export function useDataDistribution() {
  const [dataDistribution, setDataDistribution] = useState<
    DataDistribution[]
  >();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      ConsoleServices.caches()
        .getDistribution()
        .then((r) => {
          if (r.isRight()) {
            setDataDistribution(r.value);
          } else {
            setError(r.value.message);
          }
        })
        .then(() => setLoading(false));
    }
  }, [loading]);

  return { loading, error, dataDistribution };
}
