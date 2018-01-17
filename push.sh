node --version
npm --version
npm install
git clone --depth=1 https://simonmeusel:$(echo $GH_TOKEN)@github.com/simonmeusel/alan.git
git push
npm run build
[ -d dir ] && rm -r alan/docs
cp -r dist/* alan/docs
cd alan/docs
git config user.email simon.meusel.pc@t-online.de
git config user.name Simon Meusel
git add -A
if git log -1 --oneline | grep -q 'Automatic build'; then
  git commit --amend -m"Automatic build"
else
  git commit -m"Automatic build"
fi
git push origin master --force