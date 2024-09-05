import pygame
import random

# inicializa o pygame
pygame.init()

# define as cores
BRANCO = (255, 255, 255)
PRETO = (0, 0, 0)
VERDE = (0, 255, 0)
VERMELHO = (255, 0, 0)

# define o tamanho da tela
largura_tela = 600
altura_tela = 400
tela = pygame.display.set_mode((largura_tela, altura_tela))
pygame.display.set_caption('Snake Game')

# define o relógio
relogio = pygame.time.Clock()

# define o tamanho da cobra e a velocidade
tamanho_cobra = 20
velocidade = 15

# define a fonte
fonte = pygame.font.SysFont(None, 35)

def mostrar_pontuacao(pontuacao):
    texto = fonte.render(f'Pontuação: {pontuacao}', True, BRANCO)
    tela.blit(texto, [0, 0])

def desenhar_cobra(tamanho_cobra, lista_cobra):
    for x in lista_cobra:
        pygame.draw.rect(tela, VERDE, [x[0], x[1], tamanho_cobra, tamanho_cobra])

def jogo():
    game_over = False
    game_close = False

    x1 = largura_tela / 2
    y1 = altura_tela / 2

    x1_mudanca = 0
    y1_mudanca = 0

    lista_cobra = []
    comprimento_cobra = 1

    comida_x = round(random.randrange(0, largura_tela - tamanho_cobra) / 20.0) * 20.0
    comida_y = round(random.randrange(0, altura_tela - tamanho_cobra) / 20.0) * 20.0

    while not game_over:

        while game_close:
            tela.fill(PRETO)
            mensagem = fonte.render('Game Over! Pressione C para jogar de novo ou Q para sair', True, BRANCO)
            tela.blit(mensagem, [largura_tela / 6, altura_tela / 3])
            mostrar_pontuacao(comprimento_cobra - 1)
            pygame.display.update()

            for evento in pygame.event.get():
                if evento.type == pygame.KEYDOWN:
                    if evento.key == pygame.K_q:
                        game_over = True
                        game_close = False
                    if evento.key == pygame.K_c:
                        jogo()

        for evento in pygame.event.get():
            if evento.type == pygame.QUIT:
                game_over = True
            if evento.type == pygame.KEYDOWN:
                if evento.key == pygame.K_LEFT:
                    x1_mudanca = -tamanho_cobra
                    y1_mudanca = 0
                elif evento.key == pygame.K_RIGHT:
                    x1_mudanca = tamanho_cobra
                    y1_mudanca = 0
                elif evento.key == pygame.K_UP:
                    y1_mudanca = -tamanho_cobra
                    x1_mudanca = 0
                elif evento.key == pygame.K_DOWN:
                    y1_mudanca = tamanho_cobra
                    x1_mudanca = 0

        if x1 >= largura_tela or x1 < 0 or y1 >= altura_tela or y1 < 0:
            game_close = True

        x1 += x1_mudanca
        y1 += y1_mudanca
        tela.fill(PRETO)
        pygame.draw.rect(tela, VERMELHO, [comida_x, comida_y, tamanho_cobra, tamanho_cobra])
        lista_cobra.append([x1, y1])
        if len(lista_cobra) > comprimento_cobra:
            del lista_cobra[0]

        for x in lista_cobra[:-1]:
            if x == [x1, y1]:
                game_close = True

        desenhar_cobra(tamanho_cobra, lista_cobra)
        mostrar_pontuacao(comprimento_cobra - 1)

        pygame.display.update()

        if x1 == comida_x and y1 == comida_y:
            comida_x = round(random.randrange(0, largura_tela - tamanho_cobra) / 20.0) * 20.0
            comida_y = round(random.randrange(0, altura_tela - tamanho_cobra) / 20.0) * 20.0
            comprimento_cobra += 1

        relogio.tick(velocidade)

    pygame.quit()
    quit()

jogo()
