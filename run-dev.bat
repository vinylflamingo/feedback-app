cd app
npm run dev &

cd ..
cd api  
source .venv/bin/activate  
uvicorn src.main:app --reload