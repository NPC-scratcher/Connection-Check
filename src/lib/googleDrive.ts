const DRIVE_FILE_NAME = 'connection_monitor_backup.json';

export async function findBackupFile(accessToken: string): Promise<string | null> {
  const query = encodeURIComponent(`name='${DRIVE_FILE_NAME}' and trashed=false and 'root' in parents`);
  const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&spaces=drive`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) throw new Error('Error al buscar el archivo en Google Drive');

  const data = await response.json();
  if (data.files && data.files.length > 0) {
    return data.files[0].id;
  }
  return null;
}

export async function downloadBackup(accessToken: string, fileId: string): Promise<any> {
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) throw new Error('Error al descargar el archivo de Google Drive');

  return await response.json();
}

export async function uploadBackup(accessToken: string, data: any, existingFileId: string | null): Promise<string> {
  const metadata = {
    name: DRIVE_FILE_NAME,
    mimeType: 'application/json',
  };

  const fileContent = JSON.stringify(data);
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', new Blob([fileContent], { type: 'application/json' }));

  let url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
  let method = 'POST';

  if (existingFileId) {
    url = `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=multipart`;
    method = 'PATCH';
  }

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: form,
  });

  if (!response.ok) throw new Error('Error al subir el archivo a Google Drive');

  const result = await response.json();
  return result.id;
}
