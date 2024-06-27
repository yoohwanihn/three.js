CDN으로 사용하였음(type = importMap or module). npm install시 다음과 같이

# three.js
npm install --save three

# vite
npm install --save-dev vite



# 애드온
https://threejs.org/docs/#manual/en/introduction/Libraries-and-Plugins

# 샘플
https://github.com/mrdoob/three.js/tree/master


# three.js 구성요소
-  Renderer : scene과 camera 객체를 넘겨 받아 장치에 출력(렌더링)해 줌
    - Camera : 장면을 어떤 시점(관점)으로 볼 지 결정하는 객체
    - Scene : 3차원 모델과 빛 등으로 구성된 장면
        - Light : Scene을 비추는 조명
        - Mesh(Object 3D) : 3차원 모델
           - Geometry : 3차원 모델을 나타내는 형상을 의미함
           - Material : 3차원 모델의 색상이나 투명도를 나타냄
  
